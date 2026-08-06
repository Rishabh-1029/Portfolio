from pydantic import BaseModel
from typing import Optional

# ---- PROJECT -----
class ProjectBase(BaseModel):
    order_index: Optional[int] = 0
    title: str
    period: str
    description: str
    tech: str
    github: Optional[str] = None
    live: Optional[str] = None
    logo: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int

    class Config:
        from_attributes = True

# ---- EXPERIENCE -----
class ExperienceBase(BaseModel):
    order_index: Optional[int] = 0
    role: str
    company: str
    period: str
    description: str

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceResponse(ExperienceBase):
    id: int

    class Config:
        from_attributes = True

# ---- SKILL -----
class SkillBase(BaseModel):
    order_index: Optional[int] = 0
    category: str
    items: str

class SkillCreate(SkillBase):
    pass

class SkillResponse(SkillBase):
    id: int

    class Config:
        from_attributes = True

# ---- AUTH ----
class Token(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    password: str

# ---- MESSAGE ----
class MessageBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    message: str

class MessageCreate(MessageBase):
    pass

class MessageResponse(MessageBase):
    id: int
    created_at: str
    is_read: int

    class Config:
        from_attributes = True

# ---- ANALYTICS ----
class AnalyticEventBase(BaseModel):
    event_type: str
    path: str
    metadata_json: Optional[str] = None

class AnalyticEventCreate(AnalyticEventBase):
    pass

class AnalyticEventResponse(AnalyticEventBase):
    id: int
    timestamp: str

    class Config:
        from_attributes = True

# ---- BLOG ----
class BlogBase(BaseModel):
    order_index: Optional[int] = 0
    title: str
    image: Optional[str] = None
    content_md: str
    external_url: Optional[str] = None

class BlogCreate(BlogBase):
    pass

class BlogResponse(BlogBase):
    id: int
    published_date: str

    class Config:
        from_attributes = True

class PublicContentResponse(BaseModel):
    projects: list[ProjectResponse]
    experiences: list[ExperienceResponse]
    skills: list[SkillResponse]
    blogs: list[BlogResponse]
