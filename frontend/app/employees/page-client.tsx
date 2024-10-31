"use client";

import React, { useState, useEffect } from "react";
import SkillsCard from "../../components/custom/SkillsCard";
import EducationCard from "../../components/custom/EducationCard";
import ExperienceCard from "../../components/custom/ExperienceCard";
import CoursesCard from "../../components/custom/CoursesCard";
import LicenseAndCertificationsCard from "../../components/custom/LicenseAndCertificationsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIKeywords } from "@/constants/aiKeywords";
import { Book, BookCopyIcon, Brain, BrainCog, ShieldCheck } from "lucide-react";

const PageClient: React.FC = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalSkills: 0,
    totalEducation: 0,
    totalExperiences: 0,
    totalCertifications: 0,
  });

  const aiKeywords = AIKeywords.keywords;

  const fetchStats = async () => {
    try {
      const coursesRes = await fetch("/api/getCourses?page=1");
      const coursesData = await coursesRes.json();
      const totalCourses = coursesData.results.filter(
        (course: { name: string }) =>
          aiKeywords.some((keyword) =>
            course.name.toLowerCase().includes(keyword.toLowerCase())
          )
      ).length;

      const skillsRes = await fetch("/api/getSkills?page=1");
      const skillsData = await skillsRes.json();
      const totalSkills = skillsData.results.filter((skill: { name: string }) =>
        aiKeywords.some((keyword) =>
          skill.name.toLowerCase().includes(keyword.toLowerCase())
        )
      ).length;

      const educationRes = await fetch("/api/getEducation?page=1");
      const educationData = await educationRes.json();
      const totalEducation = educationData.results.filter(
        (edu: { field_of_study: string }) =>
          aiKeywords.some((keyword) =>
            edu.field_of_study.toLowerCase().includes(keyword.toLowerCase())
          )
      ).length;

      const experiencesRes = await fetch("/api/getExperiences?page=1");
      const experiencesData = await experiencesRes.json();
      const totalExperiences = experiencesData.results.filter(
        (exp: { title: string }) =>
          aiKeywords.some((keyword) =>
            exp.title.toLowerCase().includes(keyword.toLowerCase())
          )
      ).length;

      const certificationsRes = await fetch("/api/getCertifications?page=1");
      const certificationsData = await certificationsRes.json();
      const totalCertifications = certificationsData.results.filter(
        (cert: { name: string }) =>
          aiKeywords.some((keyword) =>
            cert.name.toLowerCase().includes(keyword.toLowerCase())
          )
      ).length;

      setStats({
        totalCourses,
        totalSkills,
        totalEducation,
        totalExperiences,
        totalCertifications,
      });
    } catch (error) {
      console.error("Failed to fetch statistics", error);
    }
  };

  useEffect(() => {
    if (aiKeywords.length === 0) return;

    fetchStats();
  }, [aiKeywords]);

  return (
    <div className="grid gap-4 p-4 text-white">
      <Card className="col-span-full">
        <CardHeader className="flex py-0 px-0 flex-col items-center border-b">
          <div className="flex flex-row items-center w-full py-4 px-6">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
                Dashboard Statistics (AI-Related)
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 flex flex-row text-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 justify-between items-center w-full gap-4">
            <SkillStatCard
              title="AI Related Courses"
              number={stats.totalCourses}
              icon={Book}
            />
            <SkillStatCard
              title="AI Related Skills"
              number={stats.totalSkills}
              icon={BrainCog}
            />
            <SkillStatCard
              title="AI Related Education"
              number={stats.totalEducation}
              icon={BookCopyIcon}
            />
            <SkillStatCard
              title="AI Related Experiences"
              number={stats.totalExperiences}
              icon={Brain}
            />
            <SkillStatCard
              title="AI Related Certifications"
              number={stats.totalCertifications}
              icon={ShieldCheck}
            />
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4">
        <SkillsCard aiKeywords={aiKeywords} />
        <EducationCard aiKeywords={aiKeywords} />
        <ExperienceCard aiKeywords={aiKeywords} />
        <CoursesCard aiKeywords={aiKeywords} />
        <LicenseAndCertificationsCard aiKeywords={aiKeywords} />
      </div>
    </div>
  );
};

export default PageClient;

const SkillStatCard = ({ title, number, icon: Icon }: any) => {
  return (
    <div className="flex flex-col items-center py-4 w-full bg-muted/40 rounded-lg mx-auto">
      <div className="flex flex-col items-center justify-between h-full gap-2 w-full p-4 max-w-[90%]">
        <Icon className="h-8 w-8" />
        <p className="font-semibold text-lg text-center text-foreground pt-4">
          {number}
        </p>
        <p className="font-light text-muted-foreground text-sm leading-relaxed text-center">
          {title}
        </p>
      </div>
    </div>
  );
};
