import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function CategoriesGrid() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          imageUrl: doc.data().imageUrl,
        }));
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Popular Services</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {categories.map(cat => (
          <div
            key={cat.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "10px",
              textAlign: "center",
            }}
          >
            <img
              src={cat.imageUrl}
              alt={cat.title}
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />
            <h4 style={{ marginTop: "10px" }}>{cat.title}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoriesGrid;
