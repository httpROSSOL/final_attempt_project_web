all: build run

build:
	pip install -r requirements.txt

run:
	python3 main.py