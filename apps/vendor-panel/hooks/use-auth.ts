"use client";

import { useState } from "react";

export function UseAuth() {
  const [loading] = useState(false);
  return { loading };
}
