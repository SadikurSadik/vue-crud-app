<template>
  <div class="container">
    <h2>Product List button <button @click="createProduct" class="btn btn-sm btn-success float-right mt-2">Create Product</button></h2>

    <table class="table table-bordered">
      <thead>
      <th>Title</th>
      <th>Description</th>
      <th>Price</th>
      <th>Image</th>
      <th>Action</th>
      </thead>
      <tbody>
      <tr v-for="product in products.data">
        <td>{{ product.title }}</td>
        <td>{{ product.description }}</td>
        <td>{{ product.price }}</td>
        <td><img height="40" width="40" :src="product.image" :alt="product.title"></td>
        <td>
          <button @click.prevent="editProduct(product.id)" class="btn btn-sm btn-primary mr-1">Edit</button>
          <button @click.prevent="destroy(product.id)" class="btn btn-sm btn-danger">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>
    <pagination :data="products" @pagination-change-page="index">
      <span slot="prev-nav">Previous</span>
      <span slot="next-nav">Next</span>
    </pagination>

    <div v-if="creating || editing">
      <transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-dialog modal-lg" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">{{ editing ? 'Edit' : 'Create' }} Product</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true" @click="hideModal">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <form>
                    <div class="form-group">
                      <label>Title</label>
                      <input v-model="product.title" type="text" class="form-control">
                      <p class="alert-warning" v-if="validation_errors.hasOwnProperty('title')">{{ validation_errors.title[0] }}</p>
                    </div>
                    <div class="form-group">
                      <label>Description</label>
                      <textarea v-model="product.description" class="form-control"></textarea>
                      <p class="alert-warning" v-if="validation_errors.hasOwnProperty('description')">{{ validation_errors.description[0] }}</p>
                    </div>
                    <div class="form-group">
                      <label>Price</label>
                      <input v-model="product.price" type="text" class="form-control">
                      <p class="alert-warning" v-if="validation_errors.hasOwnProperty('price')">{{ validation_errors.price[0] }}</p>
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" @click="hideModal">Close</button>
                  <button @click.prevent="editing ? updateProduct(product.id) : storeProduct()" type="button" class="btn btn-primary">Save
                    changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

  </div>
</template>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
</style>

<script>
import ProductsService from '../services/products.service';

export default {
  name: 'Products',
  data() {
    return {
      products: [],
      product: {},
      message: '',
      editing: false,
      creating: false,
      validation_errors: {},
    };
  },
  methods: {
    index(page = 1) {
      ProductsService.index(page).then(
          response => {
            this.products = response.data;
          },
          error => {
            this.message =
                (error.response && error.response.data) ||
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
          }
      );
    },
    createProduct() {
      this.validation_errors = {};
      this.product = {};
      this.creating = true;
    },
    storeProduct() {
      ProductsService.store(this.product).then(response => {
            this.hideModal();
            this.index();
          },
          error => {
            this.message = error;
          });
    },
    editProduct(id) {
      this.validation_errors = {};
      ProductsService.show(id).then(response => {
        this.product = response.data.data;
      });
      this.editing = true;
    },
    updateProduct(id) {
      ProductsService.update(id, this.product).then(response => {
          this.hideModal();
          this.index();
          this.$toastr.s("SUCCESS!", response.data.message);
        },
        error => {
          if ( error.response.status === 422 ) {
            this.validation_errors = error.response.data.errors;
          } else {
            this.$toastr.e("ERROR!", error);
          }

          this.message = error;
        }).catch(error => {
          if ( error.response.status === 422 ) {
            this.validation_errors = error.response.data.errors;
          }else {
            this.$toastr.e("ERROR!", error);
          }
        });
    },
    destroy(id) {
      ProductsService.destroy(id).then(response => {
          this.$toastr.s("SUCCESS!", response.data.message);
          this.index();
        },
        error => {
          this.message = error;
        });
    },
    hideModal() {
      this.creating = false;
      this.editing = false;
    },
    uploadImage(e){
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = e =>{
        this.previewImage = e.target.result;
      };
    }
  },
  mounted() {
    this.index()
  }
};
</script>
