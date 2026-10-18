import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router";
import "spectre.css/dist/spectre.min.css";
import "spectre.css/dist/spectre-icons.min.css";
import "spectre.css/dist/spectre-exp.min.css";
import { api } from "./api.ts";
import { Heading } from "./Heading.tsx";
import { Layout } from "./Layout.tsx";
import type { Product } from "./product.ts";

interface ProductTableRowProps {
  product: Product;
}

function ProductTableRow({ product }: ProductTableRowProps) {
  return (
    <tr>
      <td>{product.name}</td>
      <td>{product.type}</td>
      <td>
        <Link className="btn btn-link" to={`/products/${product.id}`}>
          See more!
        </Link>
      </td>
    </tr>
  );
}

interface ProductTableProps {
  products: Product[];
}

function ProductTable({ products }: ProductTableProps) {
  const rows = products.map((p) => <ProductTableRow key={p.id} product={p} />);

  return (
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th />
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function App() {
  const inputId = useId();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api
      .getAllProducts()
      .then((r) => {
        setProducts(r);
        setLoading(false);
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e : new Error(String(e)));
      });
  }, []);

  const visibleProducts = useMemo(() => {
    if (!searchText) {
      return products;
    }
    const search = searchText.toLowerCase();
    return products.filter(
      (p) =>
        p.id.toLowerCase().includes(search) ||
        p.name.toLowerCase().includes(search) ||
        p.type.toLowerCase().includes(search),
    );
  }, [searchText, products]);

  const onSearchTextChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }, []);

  // Rethrow during render so the ErrorBoundary can catch it.
  if (error) {
    throw error;
  }

  return (
    <Layout>
      <Heading text="Products" href="/" />
      <div className="form-group col-2">
        <label className="form-label" htmlFor={inputId}>
          Search
        </label>
        <input
          id={inputId}
          className="form-input"
          type="text"
          value={searchText}
          onChange={onSearchTextChange}
        />
      </div>
      {loading ? (
        <div className="loading loading-lg centered" />
      ) : (
        <ProductTable products={visibleProducts} />
      )}
    </Layout>
  );
}

export { App };
