"use client"
import React from "react"

// Client component so the year is not frozen at build time
const GetCurrentDate = () => {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>
}

export default GetCurrentDate
