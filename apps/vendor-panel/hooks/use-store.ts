"use client";

import { useState } from "react";

export function UseStore() {
  const [loading] = useState(false);
  return { loading };
}
