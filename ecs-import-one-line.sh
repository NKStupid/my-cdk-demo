# export the task def
family='fargate-task'
# one-liner
aws ecs describe-task-definition --task-definition $family \
--query "taskDefinition.{family:family, taskRoleArn:taskRoleArn, executionRoleArn:executionRoleArn, networkMode:networkMode, containerDefinitions:containerDefinitions, volumes:volumes, placementConstraints:placementConstraints, requiresCompatibilities:requiresCompatibilities, cpu:cpu, memory:memory, tags:tags, pidMode:pidMode, ipcMode:ipcMode, proxyConfiguration:proxyConfiguration}" | jq 'del(.[] | nulls)' | xargs -0 aws ecs register-task-definition --family newFamily --cli-input-json
