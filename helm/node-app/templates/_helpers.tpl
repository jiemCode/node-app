{{- define "node-app.name" -}}
node-app
{{- end }}

{{- define "node-app.fullname" -}}
{{ include "node-app.name" . }}
{{- end }}
