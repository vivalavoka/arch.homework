# arch.homework

## Запуск приложения CRUD для второго домашнего задания

```
helm install --create-namespace -n crud-ns crud simple-crud/helm-postgresql
kubectl apply -f simple-crud/manifest.yml
```

## Запуск приложения для первого домашнего задания

```
kubectl apply -f node-app/manifest.yml
```

## Minikube

Получение внешнего ip машины minikube
```
minikube service -n <namespace> <service> --url
```

Установка ingress-nginx
```
minikube addons enable ingress
```


