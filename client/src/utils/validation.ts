export interface ValidationError {
  field: string;
  message: string;
}

export function validateEmail(email: string): ValidationError | null {
  if (!email.trim()) {
    return { field: "email", message: "Email is required" };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { field: "email", message: "Please enter a valid email address" };
  }
  
  return null;
}

export function validateName(name: string): ValidationError | null {
  if (!name.trim()) {
    return { field: "name", message: "Name is required" };
  }
  
  if (name.trim().length < 2) {
    return { field: "name", message: "Name must be at least 2 characters long" };
  }
  
  return null;
}

export function validateDateOfBirth(dob: string): ValidationError | null {
  if (!dob) {
    return { field: "dob", message: "Date of birth is required" };
  }
  
  const dobDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - dobDate.getFullYear();
  
  if (age < 13) {
    return { field: "dob", message: "You must be at least 13 years old" };
  }
  
  if (age > 120) {
    return { field: "dob", message: "Please enter a valid date of birth" };
  }
  
  return null;
}

export function validateOTP(otp: string): ValidationError | null {
  if (!otp.trim()) {
    return { field: "otp", message: "OTP is required" };
  }
  
  if (!/^\d{6}$/.test(otp)) {
    return { field: "otp", message: "OTP must be 6 digits" };
  }
  
  return null;
}

export function validateNoteTitle(title: string): ValidationError | null {
  if (!title.trim()) {
    return { field: "title", message: "Note title is required" };
  }
  
  if (title.trim().length > 100) {
    return { field: "title", message: "Title must be less than 100 characters" };
  }
  
  return null;
}

export function validateNoteContent(content: string): ValidationError | null {
  if (!content.trim()) {
    return { field: "content", message: "Note content is required" };
  }
  
  if (content.trim().length > 10000) {
    return { field: "content", message: "Content must be less than 10,000 characters" };
  }
  
  return null;
}
