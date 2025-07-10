'use client';  // Add this directive at the top
import React, { useState, useEffect, useCallback } from "react"; // Added useCallback
import SkillsCard from "../../components/custom/SkillsCard";
import EducationCard from "../../components/custom/EducationCard";
import ExperienceCard from "../../components/custom/ExperienceCard";
import CoursesCard from "../../components/custom/CoursesCard";
import LicenseAndCertificationsCard from "../../components/custom/LicenseAndCertificationsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AIKeywords } from "@/constants/aiKeywords"; // Fallback import
import { Book, BookCopyIcon, Brain, BrainCog, ShieldCheck } from "lucide-react";

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

export default function EmployeesPageClient() {
  const [aiKeywords, setAiKeywords] = useState<string[]>(AIKeywords.keywords); // Default to fallback
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    courses: { total: 0, aiRelated: 0 },
    skills: { total: 0, aiRelated: 0 },
    education: { total: 0, aiRelated: 0 },
    experiences: { total: 0, aiRelated: 0 },
    certifications: { total: 0, aiRelated: 0 },
  });

  // Fetch AI keywords from API
  const fetchAIKeywords = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/getAIKeywords`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.keywords) {
          setAiKeywords(data.keywords);
        }
      }
    } catch (error) {
      console.error("Failed to fetch AI keywords, using fallback:", error);
      // Keep using the fallback from import
    }
  }, []);

  // Use useCallback to memoize fetchStats
  const fetchStats = useCallback(async () => {
    try {
      // Fetch courses
      const coursesRes = await fetch("/api/getCourses?page=1");
      const coursesData = await coursesRes.json();
      const aiRelatedCourses = coursesData?.results?.filter((course: any) =>
        aiKeywords.some((keyword) =>
          course.name.toLowerCase().includes(keyword.toLowerCase())
        )
      ) || [];

      // Fetch skills
      const skillsRes = await fetch("/api/getSkills?page=1");
      const skillsData = await skillsRes.json();
      const aiRelatedSkills = skillsData?.results?.filter((skill: any) =>
        aiKeywords.some((keyword) =>
          skill.name.toLowerCase().includes(keyword.toLowerCase())
        )
      ) || [];

      // Fetch education
      const educationRes = await fetch("/api/getEducation?page=1");
      const educationData = await educationRes.json();
      const aiRelatedEducation = educationData?.results?.filter((edu: any) =>
        aiKeywords.some((keyword) =>
          edu.field_of_study.toLowerCase().includes(keyword.toLowerCase())
        )
      ) || [];

      // Fetch experiences
      const experiencesRes = await fetch("/api/getExperiences?page=1");
      const experiencesData = await experiencesRes.json();
      const aiRelatedExperiences = experiencesData?.results?.filter((exp: any) =>
        aiKeywords.some((keyword) =>
          exp.title.toLowerCase().includes(keyword.toLowerCase())
        )
      ) || [];

      // Fetch certifications
      const certificationsRes = await fetch("/api/getCertifications?page=1");
      const certificationsData = await certificationsRes.json();
      const aiRelatedCertifications = certificationsData?.results?.filter((cert: any) =>
        aiKeywords.some((keyword) =>
          cert.name.toLowerCase().includes(keyword.toLowerCase())
        )
      ) || [];

      setStats({
        courses: {
          total: coursesData?.results?.length || 0,
          aiRelated: aiRelatedCourses.length,
        },
        skills: {
          total: skillsData?.results?.length || 0,
          aiRelated: aiRelatedSkills.length,
        },
        education: {
          total: educationData?.results?.length || 0,
          aiRelated: aiRelatedEducation.length,
        },
        experiences: {
          total: experiencesData?.results?.length || 0,
          aiRelated: aiRelatedExperiences.length,
        },
        certifications: {
          total: certificationsData?.results?.length || 0,
          aiRelated: aiRelatedCertifications.length,
        },
      });
    } catch (error) {
      console.error("Failed to fetch statistics", error);
    } finally {
      setLoading(false);
    }
  }, [aiKeywords]); // `aiKeywords` is a dependency

  useEffect(() => {
    fetchAIKeywords();
  }, [fetchAIKeywords]);

  useEffect(() => {
    if (aiKeywords.length === 0) return;
    fetchStats();
  }, [aiKeywords, fetchStats]); // Now including fetchStats in the dependencies

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
              number={stats.courses.aiRelated}
              icon={Book}
            />
            <SkillStatCard
              title="AI Related Skills"
              number={stats.skills.aiRelated}
              icon={BrainCog}
            />
            <SkillStatCard
              title="AI Related Education"
              number={stats.education.aiRelated}
              icon={BookCopyIcon}
            />
            <SkillStatCard
              title="AI Related Experiences"
              number={stats.experiences.aiRelated}
              icon={Brain}
            />
            <SkillStatCard
              title="AI Related Certifications"
              number={stats.certifications.aiRelated}
              icon={ShieldCheck}
            />
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4">
        <SkillsCard aiKeywords={aiKeywords} loading={loading} />
        <EducationCard aiKeywords={aiKeywords} loading={loading} />
        <ExperienceCard aiKeywords={aiKeywords} />
        <CoursesCard aiKeywords={aiKeywords} loading={loading} />
        <LicenseAndCertificationsCard aiKeywords={aiKeywords} />
      </div>
    </div>
  );
}
