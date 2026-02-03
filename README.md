# DB LDM

# Database Schema

```mermaid
erDiagram
    users ||--o{ project_members : "owns"
    users ||--o{ project_followers : "follows"
    users ||--o{ threads : "creates"
    users ||--o{ comments : "writes"
    users ||--o{ notifications : "receives"
    projects ||--o{ project_members : "has"
    projects ||--o{ project_followers : "followed_by"
    projects ||--o{ threads : "contains"
    projects ||--o{ labels : "has"
    threads ||--o{ comments : "has"
    threads ||--o{ thread_labels : "tagged_with"
    threads ||--o{ notifications : "triggers"
    labels ||--o{ thread_labels : "applied_to"
    users ||--o{ threads : "assigned_to"

    users {
        UUID id PK
        TEXT email UK
        TEXT name
        TEXT avatar_url
        TEXT preferred_language
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    projects {
        UUID id PK
        TEXT name
        TEXT description
        TEXT slug UK
        UUID owner_id FK
        BOOLEAN is_public
        TEXT invite_code UK
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    project_members {
        UUID id PK
        UUID project_id FK
        UUID user_id FK
        TEXT role
        TIMESTAMPTZ created_at
    }

    project_followers {
        UUID id PK
        UUID project_id FK
        UUID user_id FK
        TIMESTAMPTZ created_at
    }

    threads {
        UUID id PK
        UUID project_id FK
        UUID author_id FK
        TEXT title
        TEXT content
        TEXT original_language
        TEXT status
        INTEGER priority_weight
        UUID assigned_to FK
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    labels {
        UUID id PK
        UUID project_id FK
        TEXT name
        TEXT color
        TIMESTAMPTZ created_at
    }

    thread_labels {
        UUID id PK
        UUID thread_id FK
        UUID label_id FK
        TIMESTAMPTZ created_at
    }

    comments {
        UUID id PK
        UUID thread_id FK
        UUID author_id FK
        TEXT content
        TEXT original_language
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    notifications {
        UUID id PK
        UUID user_id FK
        UUID thread_id FK
        TEXT type
        TEXT message
        BOOLEAN is_read
        TIMESTAMPTZ created_at
    }
```
