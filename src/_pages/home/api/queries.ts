import { defineQuery } from 'groq';

/*
 * ADR-003: localized fields are returned raw (`[{language, value}]`), never through `coalesce`,
 * so a missing translation cannot be masked by the query. `_id` and `_type` stay in each
 * document projection: the content report names the document of every problem.
 */

export const HOME_CONTENT_QUERY = defineQuery(`{
  "siteSettings": *[_type == "siteSettings" && _id == "siteSettings"][0]{
    _id,
    _type,
    ownerName,
    avatar{ asset->{ _id, metadata{ lqip } }, hotspot, crop },
    email,
    githubUrl,
    githubHandle,
    linkedinUrl,
    linkedinName,
    openToWork,
    person{
      fullName,
      jobTitle[]{ _key, language, value },
      location{ locality, country, remote }
    },
    status{ open[]{ _key, language, value }, busy[]{ _key, language, value } },
    credits[]{ _key, text[]{ _key, language, value } },
    seo{ title[]{ _key, language, value }, description[]{ _key, language, value } }
  },
  "homePage": *[_type == "homePage" && _id == "homePage"][0]{
    _id,
    _type,
    hero{
      badge[]{ _key, language, value },
      titleStart[]{ _key, language, value },
      titleHighlight[]{ _key, language, value },
      titleEnd[]{ _key, language, value },
      lead[]{ _key, language, value },
      terminalScript[]{ _key, text[]{ _key, language, value } },
      focus[]{ _key, language, value }
    },
    sections{
      experience[]{ _key, language, value },
      skills[]{ _key, language, value },
      projects[]{ _key, language, value },
      watch[]{ _key, language, value }
    },
    skills{
      coreStack[]{ _key, name, tint },
      backendStack,
      aiPractices[]{
        _key,
        title[]{ _key, language, value },
        description[]{ _key, language, value }
      },
      leadership[]{
        _key,
        title[]{ _key, language, value },
        description[]{ _key, language, value },
        monogram
      }
    },
    contact{ title[]{ _key, language, value }, lead[]{ _key, language, value } }
  },
  "jobs": *[_type == "job"] | order(startDate desc){
    _id,
    _type,
    company,
    role[]{ _key, language, value },
    startDate,
    endDate,
    achievements[]{ _key, text[]{ _key, language, value } },
    technologies,
    tint
  },
  "projects": *[_type == "project"] | order(sortOrder asc){
    _id,
    _type,
    title[]{ _key, language, value },
    kind[]{ _key, language, value },
    description[]{ _key, language, value },
    placeholder[]{ _key, language, value },
    image{
      asset->{ _id, metadata{ lqip } },
      hotspot,
      crop,
      alt[]{ _key, language, value }
    },
    categories,
    technologies,
    tint,
    demoUrl,
    sourceUrl
  },
  "notes": *[_type == "watchNote"] | order(publishedAt desc){
    _id,
    _type,
    title[]{ _key, language, value },
    publishedAt,
    category,
    readingMinutes,
    excerpt[]{ _key, language, value },
    body[]{ _key, text[]{ _key, language, value } },
    takeaways[]{ _key, text[]{ _key, language, value } }
  }
}`);
