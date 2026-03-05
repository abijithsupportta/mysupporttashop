"use client";

import { useState } from "react";

export function UseAnalytics() {
  const [loading] = useState(false);
  return { loading };
}
