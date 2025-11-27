import React from "react";
import { render } from "@testing-library/react";
import Cart from "../../components/pages/Cart";

describe("Cart", () => {
  it("muestra mensaje si el carrito está vacío", () => {
    const { getByText } = render(
      <Cart
        carrito={[]}
        productos={[]}
        onRemove={() => {}}
        onChangeQty={() => {}}
        handleCheckout={() => {}}
        fechaEntrega=""
        setFechaEntrega={() => {}}
      />
    );
    expect(getByText("Tu carrito está vacío.")).toBeTruthy();
  });
});
