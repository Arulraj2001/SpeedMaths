import React from "react";
import NumberTypeClient from "@/components/learn/number-type-client";
import { numberTypes } from "@/data/number-types";

interface PageProps {
  params: Promise<{ type: string }>;
}

export function generateStaticParams() {
  return numberTypes.map((type) => ({
    type: type.id,
  }));
}

export default async function NumberTypeDetailPage({ params }: PageProps) {
  const { type } = await params;
  return <NumberTypeClient type={type} />;
}
