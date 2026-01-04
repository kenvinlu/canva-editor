web_up:
	npx nx serve canva-web

admin_up:
	cd apps/canva-admin && npm run develop

mock_up:
	npx nx serve mock-api

editor_up:
	cd libs/canva-editor && npm run dev

build_editor:
	cd libs/canva-editor && npm run build

build_admin:
	cd apps/canva-admin && npm run build

build_web:
	npx nx build canva-web --prod

gen_i18n:
	npx nx run i18n:gen.all

restore_db_local:
	@echo "Restoring database (errors may occur due to orphaned foreign keys - this is expected)..."
	pg_restore \
		-h localhost \
		-p 5432 \
		-U mac \
		-d $(DB_NAME) \
		--clean \
		--if-exists \
		--verbose \
		--no-owner \
		--no-privileges \
		./apps/canva-admin/database/prd_010426.dump 2>&1 | grep -v "ERROR:" || true
	@echo "Cleaning up orphaned foreign key references..."
	psql \
		-h localhost \
		-p 5432 \
		-U mac \
		-d $(DB_NAME) \
		-f ./apps/canva-admin/database/migrations/cleanup_orphaned_fk.sql
	@echo "Attempting to fix any failed constraints..."
	psql \
		-h localhost \
		-p 5432 \
		-U mac \
		-d $(DB_NAME) \
		-f ./apps/canva-admin/database/migrations/fix_failed_constraints.sql || true
	@echo "Database restore completed. You can now run 'make create_default_data DB_NAME=$(DB_NAME)' to create default users."

create_default_data:
	psql \
		-h localhost \
		-p 5432 \
		-U mac \
		-d $(DB_NAME) \
		-f ./apps/canva-admin/database/migrations/insert_default_user.sql

# Database management commands
create_db:
	@if [ -z "$(DB_NAME)" ]; then \
		echo "Error: DB_NAME is required. Usage: make create_db DB_NAME=my_database"; \
		exit 1; \
	fi
	/opt/homebrew/opt/postgresql@15/bin/createdb \
		-h localhost \
		-p 5432 \
		-U mac \
		$(DB_NAME)
	@echo "Database '$(DB_NAME)' created successfully!"

drop_db:
	@if [ -z "$(DB_NAME)" ]; then \
		echo "Error: DB_NAME is required. Usage: make drop_db DB_NAME=my_database"; \
		exit 1; \
	fi
	@echo "WARNING: This will permanently delete the database '$(DB_NAME)'!"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		/opt/homebrew/opt/postgresql@15/bin/dropdb \
			-h localhost \
			-p 5432 \
			-U mac \
			--if-exists \
			$(DB_NAME); \
			-f \
		echo "Database '$(DB_NAME)' dropped successfully!"; \
	else \
		echo "Operation cancelled."; \
	fi

compress_publish:
	zip -r canva-clone-publish.zip . \
        -x "node_modules/*" \
        -x "apps/canva-admin/*" \
        -x "apps/canva-web/node_modules/*" \
        -x "apps/canva-web/.next/*" \
        -x "apps/canva-web/src/app/\[locale\]/\(main\)/inbox/*" \
        -x "apps/canva-web/src/app/\[locale\]/\(main\)/pricing/*" \
        -x "apps/canva-web/src/app/\[locale\]/\(main\)/product/*" \
        -x "apps/canva-web/src/app/api/orders/*" \
        -x "apps/canva-web/src/app/api/messages/*" \
        -x "apps/canva-web/src/app/api/ecom/*" \
        -x "apps/canva-web/src/app/api/docs/*" \
        -x "apps/canva-web/src/components/inbox/*" \
        -x "apps/canva-web/src/components/pricing/*" \
        -x "libs/canva-editor/node_modules/*" \
        -x "libs/canva-editor/dist/*" \
        -x "libs/canva-editor/src/components/editor/actions.ts" \
        -x "libs/canva-editor/src/components/editor/CanvaEditor.tsx" \
        -x "libs/canva-editor/src/components/editor/DesignFrame.tsx" \
        -x "libs/canva-editor/src/components/editor/DesignPage.tsx" \
        -x "libs/canva-editor/src/components/editor/EditorContext.tsx" \
        -x "libs/canva-editor/src/components/editor/Page.tsx" \
        -x "libs/canva-editor/src/components/editor/Preview.tsx" \
        -x "libs/canva-editor/src/components/editor/query.tsx" \
        -x "libs/canva-editor/src/components/editor/resolvers.ts" \
        -x ".env" \
        -x "dist/*" \
        -x "*.log" \
        -x "tmp/*" \
        -x ".git/*" \
        -x ".claude/*" \
        -x ".nx/*" \
        -x ".vercel/*"