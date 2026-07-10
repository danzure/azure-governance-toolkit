const { app } = require('@azure/functions');

const SYSTEM_PROMPT = `You are an Azure Cloud Solutions Architect assistant. Your job is to extract configuration from a user's prompt to generate Microsoft Cloud Adoption Framework (CAF) compliant resource names.

You MUST extract the following fields and return them as a strict JSON object:
- "workload": A short string representing the workload or application (e.g., 'hr', 'marketing', 'core'). Use standard abbreviations if obvious.
- "envValue": The environment. MUST be exactly one of: "prod", "dev", "qa", "test", "stg", "uat". If they say "production", use "prod". If they say "staging", use "stg".
- "regionValue": A standard Azure region abbreviation used in naming (e.g., "uksouth", "ukwest", "eastus", "westeurope"). If they say "UK South", use "uksouth".
- "searchTerm": The human-readable name of the Azure resource they want to create. 
  IMPORTANT: If the user asks for a broader solution or architecture (like an entire environment), you MUST act as a Solutions Architect and return a comma-separated string of ALL the core Azure resources required to deploy that solution. 
  CRITICAL: You MUST use exact names from this predefined list when returning resources: "SQL database", "SQL server", "App Service plan", "App Service", "Key vault", "Kubernetes (AKS)", "Container registry", "Virtual network", "Public IP", "Managed identity (user)", "VPN Gateway", "ExpressRoute circuit", "Azure Firewall", "Function app", "Storage account", "Application Insights", "Data Factory", "Data Lake Storage", "Synapse workspace", "Log Analytics workspace", "Host Pool", "Application Group", "Workspace", "Scaling Plan", "API Management".
  
  EXAMPLES OF EXACT EXPECTED MAPPINGS:
  - For "Production E-Commerce Web App with Azure SQL Backend in West Europe", return searchTerm: "App Service plan, App Service, SQL server, SQL database, Key vault, Application Insights"
  - For "Enterprise Data Analytics Environment for Finance in UK South", return searchTerm: "Data Factory, Data Lake Storage, Synapse workspace, Key vault, Log Analytics workspace"
  - For "Azure Virtual Desktop for Remote Workers in UK South", return searchTerm: "Host Pool, Application Group, Workspace, Scaling Plan, Storage account, Virtual network"
  - For "Core Hub and Spoke Networking in UK West", return searchTerm: "Virtual network, VPN Gateway, ExpressRoute circuit, Azure Firewall, Public IP"
  - For "Serverless API Architecture for Mobile App in North Europe", return searchTerm: "Function app, API Management, Storage account, Application Insights, Key vault"
  - For "A production data analytics environment for Finance in West Europe", return searchTerm: "Data Factory, Data Lake Storage, Synapse workspace, Key vault, Log Analytics workspace"
  - For "A staging database for HR in UK South", return searchTerm: "SQL database, SQL server"
  - For "An AKS cluster for microservices in North Europe", return searchTerm: "Kubernetes (AKS), Container registry, Virtual network, Public IP, Managed identity (user)"
  - For "Machine Learning Workspace for Data Science in West Europe", return searchTerm: "Workspace, Storage account, Key vault, Application Insights, Container registry"
  - For "Staging API Management Gateway with Azure Functions in North Europe", return searchTerm: "API Management, Function app, Storage account, Application Insights"
  - For "Development Firewall and VPN Gateway Hub in UK South", return searchTerm: "Azure Firewall, VPN Gateway, Virtual network, Public IP"
  - For "Disaster Recovery Storage and Data Factory in UK West", return searchTerm: "Storage account, Data Factory, Key vault, Managed identity (user)"
  - For "Production AKS Microservices Environment in North Europe", return searchTerm: "Kubernetes (AKS), Container registry, Virtual network, Public IP, Managed identity (user), Log Analytics workspace"

If the user does not specify one of these fields, make a best-effort guess based on context, or leave it as an empty string if completely unknown, but the key MUST exist in the JSON.
Do NOT include any markdown formatting or explanations, just the JSON object.`;

app.http('generateResourceName', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        try {
            const body = await request.json();
            const { prompt } = body;

            if (!prompt) {
                return {
                    status: 400,
                    jsonBody: { error: "Please pass a prompt in the request body" }
                };
            }

            // Microsoft AI Foundry: use the OpenAI-compatible v1 endpoint
            const projectEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
            const apiKey = process.env.AZURE_OPENAI_API_KEY;
            const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

            // The Foundry project exposes /openai/v1/chat/completions
            const inferenceUrl = `${projectEndpoint}/openai/v1/chat/completions`;

            context.log(`Calling Foundry inference URL: ${inferenceUrl}`);

            const response = await fetch(inferenceUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: deploymentName,
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        { role: "user", content: prompt }
                    ],
                    response_format: { type: "json_object" },
                    temperature: 0.1
                })
            });

            if (!response.ok) {
                const errorBody = await response.text();
                context.error(`Foundry API error (${response.status}): ${errorBody}`);
                return {
                    status: 502,
                    jsonBody: { error: "AI service error", details: errorBody }
                };
            }

            const data = await response.json();
            const responseText = data.choices[0].message.content;
            
            // The response should be pure JSON
            const parsedConfig = JSON.parse(responseText);

            return {
                status: 200,
                jsonBody: parsedConfig
            };

        } catch (error) {
            context.error("Error processing request:", error);
            console.error("Full error:", error);
            return {
                status: 500,
                jsonBody: { error: "Internal Server Error", details: error.message }
            };
        }
    }
});
