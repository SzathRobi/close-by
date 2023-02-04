import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
	providers: [
		GoogleProvider({
			clientId:
				'197585377787-1uv399s4q9f3quvssnidf2upqggiakjh.apps.googleusercontent.com',
			clientSecret: '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',
			authorization: {
				params: {
					scope: 'email profile https://www.googleapis.com/auth/calendar'
				}
			}
		})
	],
	secret: process.env.SECRET,
	callbacks: {
		async session({ session, token, user }: any) {
			session.user.id = token.id;
			session.accessToken = token.accessToken;
			return session;
		},
		async jwt({ token, user, account, profile, isNewUser }) {
			if (user) {
				token.id = user.id;
			}
			if (account) {
				token.accessToken = account.access_token;
			}
			return token;
		}
	}
});
