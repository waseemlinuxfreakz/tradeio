export type AuthError = {
    success:boolean;
    message:string;
}

export type EmailAuthPayload = {
	email:string;
	password:string;
	username?:string;
	usertype?:string;
    refernece?:string|null
}
export type UserImage = {
	message:string;
	token:string;
	imageUrl:string;
}