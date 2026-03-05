"use client";

import { useState } from "react";

export function UseProducts() {
  const [loading] = useState(false);
  return { loading };
}
