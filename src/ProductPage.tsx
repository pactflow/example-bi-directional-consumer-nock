import { useEffect, useState } from "react";
import { useParams } from "react-router";
import "spectre.css/dist/spectre.min.css";
import "spectre.css/dist/spectre-icons.min.css";
import "spectre.css/dist/spectre-exp.min.css";
import { api } from "./api.ts";
import { Heading } from "./Heading.tsx";
import { Layout } from "./Layout.tsx";
import type { Product } from "./product.ts";

function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    api
      .getProduct(id)
      .then(setProduct)
      .catch(() => {
        setError(true);
      });
  }, [id]);

  // Rethrow during render so the ErrorBoundary can catch it.
  if (error) {
    throw new Error("unable to fetch product data");
  }

  return (
    <Layout>
      <Heading text="Products" href="/" />
      {product ? (
        <div>
          <p>ID: {product.id}</p>
          <p>Name: {product.name}</p>
          <p>Type: {product.type}</p>
        </div>
      ) : (
        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="loading loading-lg"
        />
      )}
    </Layout>
  );
}

export { ProductPage };
