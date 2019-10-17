import React, {useState, useEffect} from "react";
import {withFormik, Form, Field} from "formik";
import * as Yup from "yup";
import axios from "axios";

const NewUserForm = ({values, errors, touched, status}) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (status) {
      setUsers([...users, [status.name, status.email, status.password, status.role]])
    }
  },[status])
 
  return (
    
    <div>
      <Form>

        <div>
          {touched.name && errors.name && <p>{errors.name}</p>}
          <Field type="name" name="name" placeholder="Name"/>
        </div>

        <div>
          {touched.email && errors.email && <p>{errors.email}</p>}
          <Field type="email" name="email" placeholder="Email"/>
        </div>

        <div>
          {touched.password && errors.password && <p>{errors.password}</p>}
          <Field type="password" name="password" placeholder="Password"/>
        </div>

        <label>
          {touched.role && errors.role && <p>{errors.role}</p>}
          {"Role:  "}
          <Field component="select" name="role">
            <option value=""></option>
            <option value="Dad">Dad</option>
            <option value="Mom">Mom</option>
            <option value="Child">Child</option>
          </Field>
        </label>
      

        <label>
          {touched.tos && errors.tos && <p>{errors.tos}</p>}
          {"   Sell my personal data to the highest bidder"}
          <Field type="checkbox" name="tos" checked={values.tos}/>
        </label>

        <button type="submit">Submit</button>
      </Form>
      
      <div>
        {users.map(user => <p key={user}>{user.join(", ")}</p>)}
      </div>
    </div>
  );
}


const FormikUserForm = withFormik({

  mapPropsToValues({email, password, tos, role, name}) {
    return { 
      email: email || "",
      name: name || "",
      password: password || "",
      tos: tos || false,
      role: role || ""
    };  
  },

  validationSchema: Yup.object().shape({
    name: Yup.string()
      .required(),
    email: Yup.string()
      .email("Enter a valid email address")
      .required("Email is a required field"),
    password: Yup.string()
      .min(6)
      .required(),
    tos: Yup.boolean()
      .oneOf([true], "You must accept the TOS"),
    role: Yup.string()
      .required("Role is a required field")
  }),

  handleSubmit(values, {setStatus, resetForm, setSubmitting}) {

    axios
      .post("https://reqres.in/api/users", values)
      .then(res => {
        setStatus(res.data);
        resetForm();
        setSubmitting(false);
      })
      .catch(err => {
        console.log(err);
        setSubmitting(false);
      })
  }
})(NewUserForm);

export default FormikUserForm;

