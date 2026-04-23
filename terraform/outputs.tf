output "cluster_name" {
  description = "EKS cluster name"
  value       = module.eks.cluster_name
}

output "cluster_endpoint" {
  description = "EKS cluster API endpoint"
  value       = module.eks.cluster_endpoint
}

output "cluster_region" {
  description = "AWS region of the cluster"
  value       = var.aws_region
}

output "ecr_repository_url" {
  description = "ECR repository URL for pushing app images"
  value       = aws_ecr_repository.app.repository_url
}

output "kubeconfig_command" {
  description = "Run this command to update your kubeconfig"
  value       = "aws eks update-kubeconfig --region ${var.aws_region} --name ${module.eks.cluster_name}"
}
