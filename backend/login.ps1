$resposta = Invoke-RestMethod -Uri "http://localhost:3333/api/v1/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@edutrack.com","senha":"TrocarDepoisDoPrimeiroLogin123"}'
$global:token = $resposta.data.token
$global:headers = @{ "Authorization" = "Bearer $token" }
Write-Host "Login OK - token e headers disponiveis nesta sessao." -ForegroundColor Green