terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

resource "docker_network" "app_network" {
  name = "app-network"
}

resource "docker_volume" "mysql_data" {
  name = "mysql-data"
}

resource "docker_image" "mysql" {
  name = "mysql:8.0"
}

resource "docker_container" "mysql" {
  image = docker_image.mysql.image_id
  name  = "mysql-db"
  
  ports {
    internal = 3306
    external = var.mysql_port
  }
  
  networks_advanced {
    name = docker_network.app_network.name
  }
  
  volumes {
    host_path      = abspath("${path.module}/docker/database")
    container_path = "/docker-entrypoint-initdb.d"

  }
  
  volumes {
    volume_name    = docker_volume.mysql_data.name
    container_path = "/var/lib/mysql"
  }
  
  env = [
    "MYSQL_ROOT_PASSWORD=${var.mysql_root_password}",
    "MYSQL_DATABASE=${var.mysql_database}",
    "MYSQL_USER=${var.mysql_user}",
    "MYSQL_PASSWORD=${var.mysql_password}"
  ]
  
  restart = "always"
}

resource "docker_image" "backend" {
  name = "app-backend:latest"
  build {
    context = "${path.module}/docker/backend"
  }
}

resource "docker_container" "backend" {
  image = docker_image.backend.image_id
  name  = "app-backend"
  
  ports {
    internal = 3000
    external = var.backend_port
  }
  
  networks_advanced {
    name = docker_network.app_network.name
  }
  
  env = [
    "DB_HOST=mysql-db",
    "DB_PORT=3306",
    "DB_NAME=${var.mysql_database}",
    "DB_USER=${var.mysql_user}",
    "DB_PASSWORD=${var.mysql_password}",
    "PORT=3000"
  ]
  
  depends_on = [docker_container.mysql]
  restart = "always"
}

resource "docker_image" "frontend" {
  name = "app-frontend:latest"
  build {
    context = "${path.module}/docker/frontend"
  }
}

resource "docker_container" "frontend" {
  image = docker_image.frontend.image_id
  name  = "app-frontend"
  
  ports {
    internal = 80
    external = var.frontend_port
  }
  
  networks_advanced {
    name = docker_network.app_network.name
  }
  
  env = [
    "REACT_APP_API_URL=http://localhost:${var.backend_port}"
  ]
  
  depends_on = [docker_container.backend]
  restart = "always"
}