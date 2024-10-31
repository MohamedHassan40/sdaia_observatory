export interface Tweet {
  id: number;
  symbols: Symbol[];
  tweet_id: string;
  created_at: string;
  added_at: string;
  full_text: string;
  favorite_count: number;
  retweet_count: number;
  conversation_id: string;
  lang: string;
  possibly_sensitive: boolean;
  quoted_status_id: string;
  company: number;
  company_twitter_username: string;
}

export interface Symbol {
  id: number;
  symbol: string;
  created_at: string;
}

export interface Company {
  id: number;
  locations: Location[];
  funding_data: Fundingdatum | Fundingdata | null;
  name: string;
  company_id: string;
  industry: string;
  description: string;
  website_url: string;
  logo_url: string;
  cover_image_url: string;
  linkedin_username: string;
  founded_year: number;
  employee_count: number;
  universal_name: string;
  follower_count: number;
  company_twitter_username: string;
  company_twitter_followers: number;
  company_twitter_id: string;
  company_twitter_created_at: null;
  company_twitter_description: string;
}

export interface Fundingdata {
  id: number;
  updated_at: null;
  num_funding_rounds: number;
  number: number;
  last_funding_round: number;
}

export interface Fundingdatum {
  id: number;
  updated_at: null;
  num_funding_rounds: number;
  number: number;
  last_funding_round: null;
}

export interface Location {
  id: number;
  country: string;
  city: string;
  geographic_area: string;
  postal_code: string;
  line1: string;
  line2: string;
  description: string;
  is_headquarter: boolean;
  latitude: null;
  longitude: null;
}

export interface News {
  uri?: string;
  lang?: null;
  is_duplicate?: null;
  date?: null;
  time?: null;
  date_time?: null;
  date_time_pub?: string;
  data_type?: null;
  sim?: null;
  url?: string;
  title?: string;
  body?: string;
  sentiment?: null;
  wgt?: null;
  relevance?: null;
  image?: string;
  event_uri?: null;
  source?: number;
}


export interface Publication {
  id: string;
  doi: null | string;
  title: string;
  display_name: string;
  publication_year: number;
  publication_date: string;
  ids: Ids;
  language: null | string;
  primary_location: Primarylocation;
  type: string;
  type_crossref: string;
  indexed_in: string[];
  open_access: Openaccess;
  authorships: Authorship[];
  countries_distinct_count: number;
  institutions_distinct_count: number;
  corresponding_author_ids: string[];
  corresponding_institution_ids: string[];
  apc_list: any;
  apc_paid: any;
  has_fulltext: boolean;
  fulltext_origin?: string;
  cited_by_count: number;
  cited_by_percentile_year: any;
  biblio: any;
  is_retracted: boolean;
  is_paratext: boolean;
  primary_topic: any;
  topics: any;
  keywords: any;
  concepts: any;
  mesh: any;
  locations_count: number;
  locations: any;
  best_oa_location:any;
  sustainable_development_goals: any;
  
  referenced_works_count: number;
  referenced_works: string[];
  related_works: string[];
  ngrams_url: string;

  cited_by_api_url: string;
  counts_by_year: Countsbyyear[];
  updated_date: string;
  created_date: string;
  datasets?: any[];
  versions?: any[];
}

interface Countsbyyear {
  year: number;
  cited_by_count: number;
}

export interface Authorship {
  author_position?: string;
  author?: Author;
  institutions?: (Institution | Institution)[];
  countries?: (string | string)[];
  is_corresponding?: boolean;
  raw_author_name?: string;
  raw_affiliation_strings?: (string | string)[];
}

export interface Institution {
  id: string;
  display_name: string;
  ror: string;
  country_code: string;
  type: string;
  lineage: string[];
}

interface Author {
  id: string;
  display_name: string;
  orcid: null | null | string | string;
}

interface Openaccess {
  is_oa: boolean;
  oa_status: string;
  oa_url: null | string;
  any_repository_has_fulltext: boolean;
}

interface Primarylocation {
  is_oa?: boolean;
  landing_page_url?: string;
  pdf_url?: null | string;
  source?: Source;
  license?: null | string;
  version?: null | string;
  is_accepted?: boolean;
  is_published?: boolean;
}

interface Source {
  id: string;
  display_name: string;
  issn_l: null | string;
  issn: string[] | null;
  is_oa: boolean;
  is_in_doaj: boolean;
  host_organization: null | string;
  host_organization_name: null | string;
  host_organization_lineage: string[];
  host_organization_lineage_names: string[];
  type: string;
}

interface Ids {
  openalex: string;
  doi?: string;
  pmid?: string;
}

interface Meta {
  count: number;
  db_response_time_ms: number;
  page: number;
  per_page: number;
  groups_count: null;
}


export interface CompanyNews {
  id: number;
  title: string;
  description: string;
  news_url: string;
  image_url: string;
  created_at: string;
  extra_text: string;
  news_date: null;
  is_event: boolean;
  is_news: boolean;
  company: number;
}


export interface CompanyBlog {
  id: number;
  title: string;
  full_text: string;
  blog_url: string;
  blog_date: string;
  image_url: string;
  created_at: string;
  extra_text: string;
  company: number;
}


export interface CompanyProduct {
  id: number;
  title: string;
  description: string;
  product_url: string;
  image_url: string;
  created_at: string;
  extra_text: string;
  company: number;
}



export interface Product {
  id: number;
  company: Company;
  title: string;
  description: string;
  product_url: string;
  image_url: string;
  created_at: string;
  extra_text: string;
  badge: string;
}