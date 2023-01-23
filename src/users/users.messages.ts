export enum UsersMessages {
	AuthError = 'Ошибка авторизации',
	AuthSuccess = 'Авторизация успешна',
	AuthForbidden = 'Доступ запрещён',
	UserExists = 'Такой пользователь уже существует',
	Registered = 'Пользователь зарегистрирован',
	NeedAuth = 'Требуется авторизация',
	TokenRefreshSuccess = 'Обновление токена успешно',
	UserNotFound = 'Пользователь не найден',
	UserDeleted = `Пользователь #%s успешно удалён`,
}
