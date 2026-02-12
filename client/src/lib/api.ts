type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: any;
};

async function fetcher<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const { body, ...rest } = options;
  const config: RequestInit = {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...rest.headers,
    },
    credentials: "include", // Important for cookies/sessions
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}

// ===================
// Auth API
// ===================

export interface AuthUser {
  id: string;
  username: string;
}

export interface LoginResponse {
  message: string;
  user: AuthUser;
}

export interface MeResponse {
  user: AuthUser;
}

export const authApi = {
  login: (username: string, password: string) =>
    fetcher<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: { username, password },
    }),

  logout: () =>
    fetcher<{ message: string }>("/api/auth/logout", {
      method: "POST",
    }),

  me: () => fetcher<MeResponse>("/api/auth/me"),
};

// ===================
// Portfolio API
// ===================

export interface PortfolioContent {
  id: string;
  isDraft: boolean;
  profileName: string;
  profileTitle: string;
  profileDescription: string;
  profileEmail: string;
  profileLocation: string;
  profileImageUrl: string | null;
  heroTitle: string;
  heroSubtitle: string;
  heroStatus: string;
  aboutText: string | null;
  themeColors: {
    primary?: string;
    accent?: string;
    background?: string;
    foreground?: string;
  } | null;
  themeFonts: {
    serif?: string;
    sans?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: string;
  portfolioId: string;
  company: string;
  role: string;
  type: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id: string;
  portfolioId: string;
  school: string;
  degree: string;
  dates: string;
  details: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  portfolioId: string;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Portfolio extends PortfolioContent {
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
}

export const portfolioApi = {
  getPublished: () => fetcher<Portfolio>("/api/portfolio/published"),

  getDraft: () => fetcher<Portfolio>("/api/portfolio/draft"),

  saveDraft: (data: Partial<PortfolioContent>) =>
    fetcher<PortfolioContent>("/api/portfolio/save-draft", {
      method: "POST",
      body: data,
    }),

  publish: () => fetcher<Portfolio>("/api/portfolio/publish", { method: "POST" }),
};

// ===================
// Image Upload API
// ===================

export const imageApi = {
  upload: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/upload/image", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Upload failed" }));
      throw new Error(error.message || "Upload failed");
    }

    return response.json();
  },
};

// ===================
// Experience API
// ===================

export const experienceApi = {
  create: (portfolioId: string, data: Omit<Experience, "id" | "portfolioId" | "createdAt" | "updatedAt">) =>
    fetcher<Experience>("/api/experiences", {
      method: "POST",
      body: { portfolioId, ...data },
    }),

  update: (id: string, data: Partial<Experience>) =>
    fetcher<Experience>(`/api/experiences/${id}`, {
      method: "PUT",
      body: data,
    }),

  delete: (id: string) =>
    fetcher<{ message: string }>(`/api/experiences/${id}`, {
      method: "DELETE",
    }),

  reorder: (portfolioId: string, orderedIds: string[]) =>
    fetcher<{ message: string }>("/api/experiences/reorder", {
      method: "POST",
      body: { portfolioId, orderedIds },
    }),
};

// ===================
// Education API
// ===================

export const educationApi = {
  create: (portfolioId: string, data: Omit<Education, "id" | "portfolioId" | "createdAt" | "updatedAt">) =>
    fetcher<Education>("/api/education", {
      method: "POST",
      body: { portfolioId, ...data },
    }),

  update: (id: string, data: Partial<Education>) =>
    fetcher<Education>(`/api/education/${id}`, {
      method: "PUT",
      body: data,
    }),

  delete: (id: string) =>
    fetcher<{ message: string }>(`/api/education/${id}`, {
      method: "DELETE",
    }),

  reorder: (portfolioId: string, orderedIds: string[]) =>
    fetcher<{ message: string }>("/api/education/reorder", {
      method: "POST",
      body: { portfolioId, orderedIds },
    }),
};

// ===================
// Skills API
// ===================

export const skillsApi = {
  create: (portfolioId: string, data: Omit<Skill, "id" | "portfolioId" | "createdAt" | "updatedAt">) =>
    fetcher<Skill>("/api/skills", {
      method: "POST",
      body: { portfolioId, ...data },
    }),

  update: (id: string, data: Partial<Skill>) =>
    fetcher<Skill>(`/api/skills/${id}`, {
      method: "PUT",
      body: data,
    }),

  delete: (id: string) =>
    fetcher<{ message: string }>(`/api/skills/${id}`, {
      method: "DELETE",
    }),

  reorder: (portfolioId: string, orderedIds: string[]) =>
    fetcher<{ message: string }>("/api/skills/reorder", {
      method: "POST",
      body: { portfolioId, orderedIds },
    }),
};
