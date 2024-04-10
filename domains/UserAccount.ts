import { Session } from "next-auth";
import { z } from "zod";

const UserAccountSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  image: z.string().nullable(),
});

const UserAccountWithoutIDSchema = UserAccountSchema.omit({ id: true });

type UserAccountWithoutIDType = z.infer<typeof UserAccountWithoutIDSchema>;
type UserAccountType = z.infer<typeof UserAccountSchema>;

export class UserAccountWithoutID {
  private _name: string | null;
  private _email: string | null;
  private _image: string | null;

  protected constructor(data: UserAccountWithoutIDType) {
    this._name = data.name;
    this._email = data.email;
    this._image = data.image;
  }

  static create(data: UserAccountWithoutIDType): UserAccountWithoutID {
    const validatedData = UserAccountWithoutIDSchema.parse(data);
    return new UserAccountWithoutID(validatedData);
  }

  static reconstruct(data: UserAccountWithoutIDType): UserAccountWithoutID {
    return UserAccountWithoutID.create(data);
  }

  get name(): string | null {
    return this._name;
  }

  get email(): string | null {
    return this._email;
  }

  get image(): string | null {
    return this._image;
  }
}

export class UserAccount extends UserAccountWithoutID {
  private readonly _id: string;

  private constructor(data: UserAccountType) {
    super(data);
    this._id = data.id;
  }

  static create(data: UserAccountType): UserAccount {
    const validatedData = UserAccountSchema.parse(data);
    return new UserAccount(validatedData);
  }

  static reconstruct(data: UserAccountType): UserAccount {
    return UserAccount.create(data);
  }

  static createFromUnmarshalledSession(data: Session): UserAccount {
    return UserAccount.create({
      id: data.user.id,
      name: data.user.name ?? null,
      email: data.user.email ?? null,
      image: data.user.image ?? null,
    });
  }

  get id(): string {
    return this._id;
  }

  isEqual(other: UserAccount): boolean {
    return this._id === other.id;
  }
}
