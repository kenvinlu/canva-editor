"use client";

import * as React from "react";
import { Project } from "../../models/project.model";
import { CardItem } from "../card/CardItem";
import { getBestImageFormat } from "@canva-web/src/utils/image";

type ProjectCardProps = {
  project: Project;
  variant?: "default" | "compact";
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onError">;

export function ProjectCard({
  project,
  variant = "default",
  className,
}: ProjectCardProps) {

  return (
    <CardItem
      data={{
        id: project.id,
        documentId: project.documentId,
        img: getBestImageFormat(project.img)?.url,
        desc: project.title || project.desc,
      }}
      tag="Project"
      className={className}
      variant={variant}
    />
  );
}
