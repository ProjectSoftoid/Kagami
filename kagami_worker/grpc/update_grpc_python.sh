#!/bin/bash
echo "Updating grpc_python from protos..."
python -m grpc_tools.protoc --proto_path=../../grpc/ --python_out=./ --pyi_out=./ --grpc_python_out=./  ../../grpc/supervisor.proto ../../grpc/worker.proto
echo "Done"
