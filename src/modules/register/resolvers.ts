import * as bcrypt from 'bcryptjs';
import { ResolverMap } from '../../types/graphql-utils';
import { User } from '../../entity/User';

export const resolvers: ResolverMap = {
	Query: {
		hello: async (_, {  }: GQL.IHelloOnQueryArguments) => {
            const response = await User.find();
			return response;
		}
	},
	Mutation: {
		register: async (_, { email, password }: GQL.IRegisterOnMutationArguments) => {
			const userAlreadyExits = await User.findOne({
				where: { email },
				select: [ 'id' ]
			});
			if (userAlreadyExits) {
				return [
					{
						path: 'Email',
						message: 'alredy taken'
					}
				];
			}
			const hashedPassword = await bcrypt.hash(password, 10);
			const user = User.create({
				email,
				password: hashedPassword
			});
			await user.save();
			return [
				{
					path: 'Email',
					message: 'Success'
				}
			];
		}
	}
};
