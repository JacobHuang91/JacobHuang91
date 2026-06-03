.PHONY: pdf html clean help

# Generate clean 1-page PDF from resume.md
pdf:
	@echo "Generating resume.pdf with Pandoc..."
	@pandoc resume.md -o resume.pdf \
		--pdf-engine=xelatex \
		-V geometry:margin=0.4in \
		-V fontsize=9pt \
		-V pagestyle=empty \
		-V linestretch=1.0 \
		--variable=colorlinks:true
	@echo "✓ PDF generated: resume.pdf (1 page, no headers/footers)"

# Generate HTML version
html:
	@echo "Generating resume.html..."
	@pandoc resume.md -o resume.html --standalone
	@echo "✓ HTML generated: resume.html"

# Clean generated files
clean:
	@rm -f resume.pdf resume.html
	@echo "✓ Cleaned generated files"

# Show help
help:
	@echo "Resume PDF Generator"
	@echo ""
	@echo "Usage:"
	@echo "  make pdf     - Generate clean 1-page PDF (recommended)"
	@echo "  make html    - Generate resume.html for preview"
	@echo "  make clean   - Remove generated PDF and HTML files"
	@echo "  make help    - Show this help message"
	@echo ""
	@echo "Prerequisites (already installed):"
	@echo "  ✓ Pandoc"
	@echo "  ✓ BasicTeX"
