# Generate the proto schema for config files
schema:
	protoc -I=config/schema --python_out=jitsi/schema config/schema/*.proto

# Clear generated python files
clean:
	rm jitsi/schema/*pb2.py
