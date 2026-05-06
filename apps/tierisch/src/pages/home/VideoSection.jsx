import React from "react";
import Reveal from "../../components/Reveal";
import SectionShell from "../../components/ui/SectionShell";
import VideoBlock from "../../components/ui/VideoBlock";

export default function VideoSection() {
  return (
    <SectionShell className="py-14">
      <Reveal>
        <VideoBlock />
      </Reveal>
    </SectionShell>
  );
}