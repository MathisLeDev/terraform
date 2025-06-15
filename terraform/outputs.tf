output "frontend_url" {
  description = "URL du frontend"
  value       = "http://localhost:${var.frontend_port}"
}

output "backend_url" {
  description = "URL du backend"
  value       = "http://localhost:${var.backend_port}"
}

output "database_url" {
  description = "URL de la base de données"
  value       = "mysql://${var.mysql_user}:${var.mysql_password}@localhost:${var.mysql_port}/${var.mysql_database}"
  sensitive   = true
}

output "services_info" {
  description = "Informations sur tous les services"
  value = {
    frontend = {
      url  = "http://localhost:${var.frontend_port}"
      port = var.frontend_port
    }
    backend = {
      url  = "http://localhost:${var.backend_port}"
      port = var.backend_port
    }
    database = {
      host     = "localhost"
      port     = var.mysql_port
      database = var.mysql_database
      user     = var.mysql_user
    }
  }
}