import Cookies from "js-cookie";

export async function uploadFile(file) {
  try {
    const token = Cookies.get("accessToken");
    const body = new FormData();
    body.append("image", file);

    const res = await fetch(
      "https://api.lessortiesdediane.com/api/v1/blogs/blog-image",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: body,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Image upload failed");
    }

    return data.url;
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
}
