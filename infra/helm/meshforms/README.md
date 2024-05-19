```
helm install --kubeconfig=../../../../meshdb/infra/tf/k3s.yaml -f values.yaml --namespace meshforms --create-namespace meshforms ./
```

Upgrade with

```
helm upgrade --kubeconfig=../../../../meshdb/infra/tf/k3s.yaml -f values.yaml --namespace meshforms meshforms ./
```
