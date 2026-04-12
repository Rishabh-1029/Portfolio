from sqlalchemy import Column, Integer, String, Text
from core.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    order_index = Column(Integer, default=0)
    title = Column(String, index=True)
    period = Column(String)
    description = Column(Text)
    tech = Column(String) # comma separated
    github = Column(String, nullable=True)
    live = Column(String, nullable=True)
    logo = Column(String, nullable=True)

class Experience(Base):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True)
    order_index = Column(Integer, default=0)
    role = Column(String)
    company = Column(String)
    period = Column(String)
    description = Column(Text)

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    order_index = Column(Integer, default=0)
    category = Column(String)
    items = Column(String) # comma separated

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String, nullable=True)
    message = Column(Text)
    created_at = Column(String) # ISO 8601 string
    is_read = Column(Integer, default=0) # SQLite boolean 0/1

class AnalyticEvent(Base):
    __tablename__ = "analytics"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String, index=True) # "page_view", "click"
    path = Column(String)
    metadata_json = Column(Text, nullable=True)
    timestamp = Column(String) # ISO 8601 string

class Blog(Base):
    __tablename__ = "blogs"

    id = Column(Integer, primary_key=True, index=True)
    order_index = Column(Integer, default=0)
    title = Column(String)
    image = Column(String, nullable=True)
    content_md = Column(Text)
    external_url = Column(String, nullable=True)
    published_date = Column(String) # ISO 8601 string
