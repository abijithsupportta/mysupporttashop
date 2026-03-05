"use client";

import { useState } from "react";

export function UseCustomers() {
  const [loading] = useState(false);
  return { loading };
}
