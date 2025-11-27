import React from "react";
import { render } from "@testing-library/react";
import ProductList from "../../components/pages/ProductList";

describe("ProductList", () => {
  it("renderiza productos en la lista", () => {
    const productos = [
      { id: "1", name: "Manzana", category: "Frutas Frescas", precio: 1200, stock: 10, img: "", origen: "Chile" }
    ];
    const { getByText } = render(
      <ProductList productos={productos} addToCart={() => {}} />
    );
    expect(getByText("Manzana")).toBeTruthy();
  });
});
