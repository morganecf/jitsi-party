.PHONY: vhq-up
vhq-up:
	terraform plan -var 'vhq_enabled=true,test_mode=true' -out .tfplan

.PHONY: vhq-down
vhq-down:
	terraform plan -var 'vhq_enabled=false,test_mode=false' -out .tfplan

.PHONY: vhq-test
vhq-test:
	terraform plan -var 'vhq_enabled=true,test_mode=true' -out .tfplan

.PHONY: apply
apply:
	terraform apply .tfplan

.PHONY: clean
clean:
	rm -f .tfplan
