export const API_URL = "http://127.0.0.1:8000";

export async function createMission(goal) {
  const token = localStorage.getItem("token");

  console.log("CREATE MISSION TOKEN:", token);

  const response = await fetch(`${API_URL}/api/missions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      goal: goal.trim(),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to create mission");
  }

  return data;
}


export async function evaluateOffer(missionGoal) {
  const token = localStorage.getItem("token");

  console.log("EVALUATE OFFER TOKEN:", token);

  if (!token) {
    throw new Error("Authentication token not found. Please login again.");
  }

  const response = await fetch(
    `${API_URL}/api/missions/evaluate-offer`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mission_goal: missionGoal,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to evaluate offer"
    );
  }

  return data;
}
export async function getDataSummary() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const response = await fetch(
    `${API_URL}/api/data/summary`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to fetch data summary"
    );
  }

  return data;
}
export async function getSalesHistory() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const response = await fetch(
    `${API_URL}/api/data/sales-history`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to fetch sales history"
    );
  }

  return data;
}
export async function getAgentActivity() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const response = await fetch(
    `${API_URL}/api/agents/activity`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to fetch agent activity"
    );
  }

  return data;
}
export async function approveMissionAction({
  product_id,
  proposed_price,
  discount_percentage,
  decision,
}) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const response = await fetch(
    `${API_URL}/api/missions/approval`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id,
        proposed_price,
        discount_percentage,
        decision,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Approval action failed"
    );
  }

  return data;
}

export async function getProducts() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication token not found.");
  const response = await fetch(`${API_URL}/api/data/products`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to fetch products");
  return data;
}

export async function getWeather() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return { status: "unavailable", weather: null };
    const response = await fetch(`${API_URL}/api/radar/weather`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return { status: "unavailable", weather: null };
    return await response.json();
  } catch (e) {
    return { status: "unavailable", weather: null };
  }
}

export async function getEvents() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return { status: "unavailable", events: [] };
    const response = await fetch(`${API_URL}/api/radar/events`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return { status: "unavailable", events: [] };
    return await response.json();
  } catch (e) {
    return { status: "unavailable", events: [] };
  }
}

export async function getLocalCommerce() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication token not found.");
  const response = await fetch(`${API_URL}/api/radar/local-commerce`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to fetch local commerce");
  return data;
}

export async function getWeatherAnalysis() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication token not found.");
  const response = await fetch(`${API_URL}/api/radar/weather-analysis`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to fetch weather analysis");
  return data;
}

export async function getDemandRadar() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication token not found.");
  const response = await fetch(`${API_URL}/api/agents/demand-radar`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to fetch demand radar");
  return data;
}

export async function getFestivalOptions() {
  const response = await fetch(`${API_URL}/api/radar/festival-options`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to fetch festival options");
  return data;
}

export async function analyzeFestivalDemand(reqData) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication token not found.");
  const response = await fetch(`${API_URL}/api/radar/festival-demand`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reqData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to analyze festival demand");
  return data;
}

export async function createFestivalMission(reqData) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication token not found.");
  const response = await fetch(`${API_URL}/api/missions/create-festival-mission`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reqData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to create festival mission");
  return data;
}

export async function uploadSalesData(file) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication token not found. Please login again.");
  
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await fetch(`${API_URL}/api/data/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await response.json();
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("merchant");
    throw new Error("Session expired or invalid token. Please log in again.");
  }
  if (!response.ok) throw new Error(data.detail?.errors?.join(", ") || data.detail || "Failed to upload sales data");
  return data;
}

export async function uploadProductEconomics(file) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication token not found. Please login again.");
  
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await fetch(`${API_URL}/api/products/economics/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await response.json();
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("merchant");
    throw new Error("Session expired or invalid token. Please log in again.");
  }
  if (!response.ok) throw new Error(data.detail?.errors?.join(", ") || data.detail || "Failed to upload product economics");
  return data;
}

export async function trainDemandModel() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication token not found.");
  const response = await fetch(`${API_URL}/api/ml/train-demand-model`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to train demand model");
  return data;
}

export async function updateMerchantLocation(city, latitude, longitude) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication token not found.");
  const response = await fetch(`${API_URL}/api/merchant/location`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ city, latitude, longitude }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to update location");
  return data;
}

export async function registerUser({ email, password, business_name }) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, business_name }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Registration failed");
  }
  return data;
}

export async function executeMission({ product_id, proposed_price, discount_percentage, action_name }) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication token not found.");
  const response = await fetch(`${API_URL}/api/missions/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      product_id,
      proposed_price,
      discount_percentage,
      action_name: action_name || "Promotional Discount Campaign",
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Execution failed");
  return data;
}

export async function getLatestExecution() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication token not found.");
  const response = await fetch(`${API_URL}/api/missions/latest-execution`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to fetch latest execution");
  return data;
}