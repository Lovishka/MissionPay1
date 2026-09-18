export const evaluateOffer = async (missionGoal) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    "http://127.0.0.1:8000/api/missions/evaluate-offer",
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
    throw new Error(data.detail || "Failed to evaluate offer");
  }

  return data;
};