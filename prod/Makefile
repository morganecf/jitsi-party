.PHONY: vhq-up
vhq-up:
	terraform plan -var 'vhq_enabled=true' -out .tfplan

.PHONY: vhq-down
vhq-down:
	terraform plan -var 'vhq_enabled=false' -out .tfplan

.PHONY: apply
apply:
	terraform apply .tfplan

.PHONY: clean
clean:
	rm -f .tfplan
