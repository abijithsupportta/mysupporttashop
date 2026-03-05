"use client";

import { useState } from "react";

export function UseUpload() {
  const [loading] = useState(false);
  return { loading };
}
