variable "frontend_port" {
  description = "Port externe pour le frontend"
  type        = number
  default     = 3001
}

variable "backend_port" {
  description = "Port externe pour le backend"
  type        = number
  default     = 3000
}

variable "mysql_port" {
  description = "Port externe pour MySQL"
  type        = number
  default     = 3306
}

variable "mysql_root_password" {
  description = "Mot de passe root MySQL"
  type        = string
  default     = "rootpassword"
  sensitive   = true
}

variable "mysql_database" {
  description = "Nom de la base de données"
  type        = string
  default     = "appdb"
}

variable "mysql_user" {
  description = "Utilisateur MySQL"
  type        = string
  default     = "appuser"
}

variable "mysql_password" {
  description = "Mot de passe utilisateur MySQL"
  type        = string
  default     = "apppassword"
  sensitive   = true
}