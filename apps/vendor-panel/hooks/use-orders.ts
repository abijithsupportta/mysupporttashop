"use client";

import { useState } from "react";

export function UseOrders() {
  const [loading] = useState(false);
  return { loading };
}
