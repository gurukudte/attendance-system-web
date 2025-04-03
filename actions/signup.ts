"use server";

const signup = async (values: any) => {
  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    return await response.json();
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export default signup;
