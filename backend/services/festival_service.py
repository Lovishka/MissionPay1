import os
import pandas as pd
from typing import Dict, Any, List
from sqlalchemy.orm import Session

DATASET_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "data",
    "indian_festival_merchant_training_dataset.csv"
)

_df_cache = None

def load_dataset() -> pd.DataFrame:
    global _df_cache
    if _df_cache is None:
        if os.path.exists(DATASET_PATH):
            _df_cache = pd.read_csv(DATASET_PATH)
        else:
            # Fallback path if loaded from different directory
            alt_path = "backend/data/indian_festival_merchant_training_dataset.csv"
            if os.path.exists(alt_path):
                _df_cache = pd.read_csv(alt_path)
            else:
                raise FileNotFoundError(f"Festival dataset not found at {DATASET_PATH}")
    return _df_cache


def get_festival_options() -> Dict[str, List[str]]:
    df = load_dataset()
    
    festivals = sorted([str(f).strip() for f in df["festival_name"].dropna().unique()])
    
    # Extract unique cities from cities_markets
    raw_cities = df["cities_markets"].dropna().unique()
    cities_set = set()
    for item in raw_cities:
        for c in str(item).split(","):
            c_clean = c.strip()
            if c_clean:
                cities_set.add(c_clean)
    
    # Ensure major cities are listed cleanly first
    default_cities = ["Delhi", "Mumbai", "Jaipur", "Lucknow", "Indore", "Ahmedabad", "Varanasi", "Gaya", "Kochi", "Bengaluru", "Pune"]
    for dc in default_cities:
        cities_set.add(dc)
    
    locations = sorted(list(cities_set))
    
    merchant_types = sorted([str(m).strip().title() for m in df["merchant_type"].dropna().unique()])
    
    return {
        "festivals": festivals,
        "locations": locations,
        "merchant_types": merchant_types
    }


def analyze_festival_demand(
    festival_name: str,
    location: str,
    merchant_type: str,
    db: Session = None,
    merchant_id: int = None
) -> Dict[str, Any]:
    df = load_dataset()
    
    fest_clean = festival_name.strip().lower()
    loc_clean = location.strip().lower()
    mtype_clean = merchant_type.strip().lower()
    
    # 1. Filter by festival name
    fest_df = df[df["festival_name"].astype(str).str.lower().str.contains(fest_clean, na=False)]
    if fest_df.empty:
        fest_df = df # Fallback to full df if festival not found
    
    # 2. Location Matching Hierarchy
    match_level = "Festival-level Match"
    matched_df = fest_df[fest_df["cities_markets"].astype(str).str.lower().str.contains(loc_clean, na=False)]
    
    if not matched_df.empty:
        match_level = "Exact City Match"
    else:
        # Try state/region match
        matched_df = fest_df[fest_df["states_regions"].astype(str).str.lower().str.contains(loc_clean, na=False)]
        if not matched_df.empty:
            match_level = "State/Region Match"
        else:
            matched_df = fest_df # Fallback to festival-level
            
    # 3. Merchant Type Matching
    mtype_df = matched_df[matched_df["merchant_type"].astype(str).str.lower().str.contains(mtype_clean, na=False)]
    if not mtype_df.empty:
        selected_rows = mtype_df
    else:
        selected_rows = matched_df
        
    # Take the top matched record
    row = selected_rows.iloc[0].to_dict()
    
    # Extract dataset fields
    demand_level = str(row.get("demand_level", "High")).upper()
    peak_period = str(row.get("peak_period", "Peak festival days"))
    season_month = str(row.get("season_month", ""))
    cultural_sig = str(row.get("cultural_significance", ""))
    reason = str(row.get("reason", "High seasonal demand anticipated for festival period."))
    rec_action = str(row.get("recommended_action", "Increase inventory and prepare promotional bundles."))
    raw_conf = row.get("confidence", 0.88)
    
    try:
        conf_val = float(raw_conf)
        conf_pct = f"{int(conf_val * 100 if conf_val <= 1.0 else conf_val)}%"
    except Exception:
        conf_pct = "88%"
        
    # Process product categories from matched rows
    product_cat_raw = str(row.get("product_categories", ""))
    
    # Collect all product categories from selected_rows for richness
    categories_list = []
    seen_cats = set()
    
    for idx, r in selected_rows.iterrows():
        cat_str = str(r.get("product_categories", ""))
        if cat_str and cat_str not in seen_cats:
            seen_cats.add(cat_str)
            cat_display = cat_str.replace("_", " ").title()
            
            # Formulate action
            action_text = "Increase inventory before peak period"
            if "high" in demand_level.lower():
                action_text = "Stock up & set fast replenishment threshold"
            elif "medium" in demand_level.lower():
                action_text = "Prepare additional stock & monitor velocity"
                
            conf_item = str(r.get("confidence", 0.85))
            try:
                c_val = float(conf_item)
                c_str = f"{int(c_val * 100 if c_val <= 1.0 else c_val)}%"
            except Exception:
                c_str = "85%"

            categories_list.append({
                "category_name": cat_display,
                "raw_category": cat_str,
                "demand_level": demand_level,
                "action": action_text,
                "confidence": c_str
            })
            if len(categories_list) >= 4:
                break

    if not categories_list:
        categories_list = [
            {
                "category_name": "Festival Sweets & Gift Boxes",
                "raw_category": "sweets",
                "demand_level": demand_level,
                "action": "Increase inventory before peak period",
                "confidence": conf_pct
            },
            {
                "category_name": "Festive Grocery & Dry Fruits",
                "raw_category": "grocery",
                "demand_level": "HIGH",
                "action": "Maintain safety stock for peak days",
                "confidence": "85%"
            }
        ]

    # 4. Integrate DB Product Economics if available
    db_products = []
    if db and merchant_id:
        try:
            economics_rows = db.query(ProductEconomics).filter(ProductEconomics.merchant_id == merchant_id).all()
            for econ in economics_rows:
                selling = float(econ.selling_price)
                cost = float(econ.cost_price)
                margin = selling - cost
                db_products.append({
                    "product_id": econ.product_id,
                    "selling_price": selling,
                    "cost_price": cost,
                    "margin": margin,
                    "max_discount_percentage": float(econ.max_discount_percentage or 10.0),
                    "is_demand_based": False
                })
        except Exception as e:
            print("ProductEconomics lookup error:", e)

    # Attach DB products to categories if matched
    for cat in categories_list:
        cat["matched_economics"] = db_products[:2] if db_products else []

    return {
        "status": "success",
        "festival_name": festival_name.strip().title(),
        "location": location.strip().title(),
        "merchant_type": merchant_type.strip().title(),
        "match_level": match_level,
        "expected_demand": demand_level,
        "peak_period": peak_period,
        "season_month": season_month,
        "cultural_significance": cultural_sig,
        "recommended_products": categories_list,
        "reason": reason,
        "recommended_action": rec_action,
        "confidence": conf_pct,
        "customer_behavior": str(row.get("customer_behavior", "Increased walk-in and quick digital orders")),
        "customer_segment": str(row.get("customer_segment", "Local shoppers & families")),
        "payment_behavior": str(row.get("payment_behavior", "High UPI & QR digital payments")),
        "inventory_needs": str(row.get("inventory_needs", "Prioritize fast replenishment during peak days")),
        "staffing_needs": str(row.get("staffing_needs", "Add counter staff during peak hours")),
        "business_risks": str(row.get("business_risks", "Demand spikes causing stockouts")),
        "data_source_label": "Prototype / Dataset-based Forecast"
    }
