variable "vhq_enabled" {
  type    = bool
  default = false
}

variable "vhq_placeholder_enabled" {
  type    = bool
  default = false
}

variable "party_config" {
  type     = string
  required = true
}

variable "party_theme" {
  type     = string
  required = true
}
